import Header from "../components/Header";
import TableContent from "../components/TableContent";

export default function Home() {
    return (
        <>
            <Header />
            <section className="content">
                <TableContent />
            </section>
        </>
    )
}