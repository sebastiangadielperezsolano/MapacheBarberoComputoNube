package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cliente_barbero")
public class ClienteBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCB")
    private Long idCB;

    @NotNull
    @Column(name = "estatus")
    private Boolean estatus = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idCliente")
    @JsonIgnoreProperties({"foto", "turnos", "clientesBarberos"})
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idBarbero")
    @JsonIgnoreProperties({"foto", "turnos", "disponibilidades", "clientesBarberos", "sucursal"})
    private Barbero barbero;
}